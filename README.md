# Ripeti

チャプターを設定できるYouTubeプレイヤー  

## できること

参考動画：https://www.youtube.com/watch?time_continue=4&v=LgOHSWyG-PM  

画面上部にマウスを持っていくと上側にバーが表示される．  
真ん中の入力欄にYouTube動画ページのURLを入力して検索ボタンを押すことで動画を再生する．  
左側のメニューボタンは現在未実装．  

![ss1](https://user-images.githubusercontent.com/15711514/37832404-d9c38772-2eeb-11e8-9f4d-593088d5c262.png)  

画面下部にマウスを持っていくとコントローラが表示される．  
動画の再生と一時停止，音量の調整，シークバーの移動ができる．  
右下の時計マークのチャプターボタンで現在の再生時間をチャプターに設定できる．  

![ss2](https://user-images.githubusercontent.com/15711514/37832427-e7ccf47a-2eeb-11e8-89d4-ade84a3086cb.png)  

チャプターボタンの右隣にある三角マークのボタンを押すとチャプターリストが開く．再生時間を選択することでその時間に移動する．  

![ss3](https://user-images.githubusercontent.com/15711514/37832443-f39cc672-2eeb-11e8-8ebf-686328dd63fb.png)  

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[7c4e3e9](https://github.com/SimulatedGREG/electron-vue/tree/7c4e3e90a772bd4c27d2dd4790f61f09bae0fcef) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

## License
MIT
