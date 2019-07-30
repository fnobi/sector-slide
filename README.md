# sector-slide

## はじめに

- このツールはmarkdownでスライドを作成するためのツールです

## demo
https://fnobi.github.io/sector-slide/demo/

### ほかのツールとは何が違うの？

- スライド用に整形したmarkdownを書く必要が（ほとんど）ありません！
- htmlのアウトラインを意識したmarkdownを作成するだけで、話しやすいスライドWebアプリに整形されます

## インストール

```
# install
$ npm -g install sector-slide
```

## 使い方

```
# markdownをスライドに変換
$ sector-slide sample.md # ./slide/index.html が生成されます 

# スライドに変換して、そのままWebサーバーとブラウザでプレビュー
$ sector-slide --server sample.md
```
