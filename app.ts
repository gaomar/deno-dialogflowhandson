import { Application, Context } from "https://deno.land/x/abc@v1.0.0-rc10/mod.ts"
import "https://deno.land/x/dotenv/load.ts"

const app = new Application()

app.static('/', './public')

// htmlファイルを読み込む
app.get('/', async (ctx: Context) => {
    await ctx.file('./public/index.html')
})

// Dialogflowからの処理
app.post('/', async (ctx: Context) => {
    // DialogflowのBodyを取得
    const {queryResult} = await (ctx.body())

    // タイトル名をUTF-8変換
    let title: string = encodeURI(queryResult.queryText)

    // 楽天APIに問い合わせ
    const res = await fetch(`https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?format=json&keyword=${title}&applicationId=${Deno.env.get('APPLICATION_Id')}`)
    const json = res.json()
    const data = await json
    const items = data.Items

    // JSON成形
    const bookList = items.map((book: any) => (
        {
            type: "accordion",
            title: book.Item.title,
            subtitle: book.Item.author,
            text: `発売日: ${book.Item.salesDate}<br>価格: ${book.Item.itemPrice}円`
        }
    ))

    let js = {}

    // Dialogflowレスポンス設定
    js = {
        "fulfillmentMessages": [
            {
                "payload": {
                    "richContent": [
                        bookList
                    ]
                }
            }
        ]
    }

    // JSONのレスポンスを返す
    await ctx.json(js)

})

// ポート開く
app.start({port: 3000})
