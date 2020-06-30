import { Application, Context } from "https://deno.land/x/abc@v1.0.0-rc10/mod.ts"

const app = new Application()

app.static('/', './public')

// htmlファイルを読み込む
app.get('/', async (ctx: Context) => {
    await ctx.file('./public/index.html')
})

// Dialogflowからの処理
app.post('/', async (ctx: Context) => {

    // Intent名を取得
    const {queryResult} = await (ctx.body())
    const displayName = queryResult.intent.displayName

    // レスポンスjson格納用
    let js = {}

    // オプションリスト
    const opt = [
        {"text": "情報"},
        {"text": "説明"},
        {"text": "画像"},
        {"text": "ボタン"},
        {"text": "リスト"},
        {"text": "アコーディオン"},
        {"text": "組み合わせ"}
    ]

    if (displayName === 'Default Fallback Intent') {
        if (queryResult.queryText === '情報') {
            js = {
                "fulfillmentMessages": [
                    {
                        "payload": {
                            "richContent": [
                                [
                                  {
                                    "type": "info",
                                    "title": "情報レスポンス",
                                    "subtitle": "サブタイトル\nクリックすると別のページに飛ぶよ",
                                    "image": {
                                      "src": {
                                        "rawUrl": "https://www.i-enter.co.jp/images/favicon.ico"
                                      }
                                    },
                                    "actionLink": "https://www.i-enter.co.jp"
                                  },
                                  {
                                    "type": "chips",
                                    "options": opt,
                                  }
                                ]
                            ]
                        }
                    }
                ]
            }
        } else if (queryResult.queryText === '説明') {
            js = {
                "fulfillmentMessages": [
                    {
                        "payload": {
                            "richContent": [
                                [
                                  {
                                    "type": "description",
                                    "title": "説明レスポンス",
                                    "text": [
                                        "説明1行目",
                                        "説明2行目"
                                    ]
                                  },
                                  {
                                    "type": "chips",
                                    "options": opt,
                                  }
                                ]
                            ]
                        }
                    }
                ]
            }
        } else if (queryResult.queryText === '画像') {
            js = {
                "fulfillmentMessages": [
                    {
                        "payload": {
                            "richContent": [
                                [
                                  {
                                    "type": "image",
                                    "rawUrl": "https://deno.land/logo.svg",
                                    "accessibilityText": "Deno logo"
                                  },
                                  {
                                    "type": "chips",
                                    "options": opt,
                                  }
                                ]
                            ]
                        }
                    }
                ]
            }
        } else if (queryResult.queryText === 'ボタン') {
            js = {
                "fulfillmentMessages": [
                    {
                        "payload": {
                            "richContent": [
                                [
                                    {
                                        "type": "button",
                                        "icon": {
                                          "type": "sentiment_satisfied_alt", // 何も指定しなければ矢印アイコン
                                          "color": "#FF9800"
                                        },
                                        "text": "クリックすると別のページに飛ぶよ",
                                        "link": "https://www.i-enter.co.jp",
                                        "event": {
                                            "name": "RESULT",
                                            "languageCode": "ja-JP",
                                            "parameters": {
                                                "hoge": "ボタンクリック"
                                            }
                                        }
                                    },
                                    {
                                    "type": "chips",
                                    "options": opt,
                                  }
                                ]
                            ]
                        }
                    }
                ]
            }
        } else if (queryResult.queryText === 'リスト') {
            js = {
                "fulfillmentMessages": [
                    {
                        "payload": {
                            "richContent": [
                                [
                                    {
                                        "type": "list",
                                        "title": "リスト1タイトル",
                                        "subtitle": "リスト1 - クリックしてみてね",
                                        "event": {
                                          "name": "RESULT",
                                          "languageCode": "ja-JP",
                                          "parameters": {
                                              "hoge": "リスト1をクリック"
                                          }
                                        }
                                    },
                                    {
                                        "type": "divider"
                                    },
                                    {
                                        "type": "list",
                                        "title": "リスト2タイトル",
                                        "subtitle": "リスト2 - クリックしてみてね",
                                        "event": {
                                          "name": "RESULT",
                                          "languageCode": "ja-JP",
                                          "parameters": {
                                              "hoge": "リスト2をクリック"
                                          }
                                        }
                                    },
                                    {
                                    "type": "chips",
                                    "options": opt,
                                  }
                                ]
                            ]
                        }
                    }
                ]
            }
        } else if (queryResult.queryText === 'アコーディオン') {
            js = {
                "fulfillmentMessages": [
                    {
                        "payload": {
                            "richContent": [
                                [
                                    {
                                        "type": "accordion",
                                        "title": "アコーディオンレスポンス",
                                        "subtitle": "サブタイトル",
                                        "text": "アコーディオンテキスト"
                                    },
                                    {
                                    "type": "chips",
                                    "options": opt,
                                  }
                                ]
                            ]
                        }
                    }
                ]
            }
        } else if (queryResult.queryText === '組み合わせ') {
            js = {
                "fulfillmentMessages": [
                    {
                        "payload": {
                            "richContent": [
                                [
                                    {
                                        "type": "image",
                                        "rawUrl": "https://deno.land/logo.svg",
                                        "accessibilityText": "Denoイメージ"
                                    },
                                    {
                                        "type": "info",
                                        "title": "組み合わせレスポンス",
                                        "subtitle": "今まで紹介したのを組み合わせられるよ",
                                        "actionLink": "https://cloud.google.com/dialogflow/docs/integrations/dialogflow-messenger#info_response_type"
                                    },
                                    {
                                    "type": "chips",
                                    "options": opt,
                                  }
                                ]
                            ]
                        }
                    }
                ]
            }
        } else {
            js = {
                "fulfillmentMessages": [
                    {
                        "payload": {
                            "richContent": [
                                [
                                    {
                                    "type": "chips",
                                    "options": opt,
                                  }
                                ]
                            ]
                        }
                    }
                ]
            }
        }
    }

    // jsonのレスポンスを返す
    await ctx.json(js)
})

// ポート開く
app.start({port: 3000})
