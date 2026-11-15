Gamepad Tester v1.15
ドラム図のSVG表示をdisplayで明示し、選択時に表示されない問題を修正。
「その他 → ビートマニア」に5鍵／7鍵選択と簡略図を追加。鍵盤とスクラッチ両方向、SELECT/STARTが点灯します。
5鍵は提供写真：左から鍵盤1=□ B2、2=L1 B4、3=× B0、4=R1 B5、5=○ B1。時計回り=↑ B12、反時計回り=↓ B13。
7鍵PS端子は公開実装：1=□ B2、2=L1 B4、3=× B0、4=R1 B5、5=○ B1、6=L2 B6、7=← B14。スクラッチ上下 B12/B13。
SELECT=B8、START=B9。PS端子用の通常USB/BT変換経路を使用。変換器の更新は不要。
7鍵IIDXにはPS端子型とPC向けUSB型があります。USB直結はブラウザGamepad APIに現れる機種のみ利用可能。USB機のボタン番号は一律ではなく手動割当が必要です。
スクラッチは方向ボタンとして確認。USB機が回転を軸だけで送る場合、この画面で軸の学習・角度復元はできません。数値表示で出力を確認してください。
5鍵／7鍵の割当は別々に保存。選択鍵数も保存。7鍵は資料による対応で実機未検証。自動判別は行いません。
参考一次実装: https://github.com/CrazyRedMachine/BEMANI_PSX_Adapter/blob/main/BEMANI_PSX_Adapter/BEMANI_PSX_Adapter.ino
USB型公式資料: https://p.eagate.573.jp/game/infinitas/2/startup/faq.html
GitHub PagesへZIP内容を上書きし、v1.15表示を確認してください。
構文・模擬入力・5/7切替・保存分離・ドラム表示を検査。更新版の実ブラウザ・実機検証は未実施。
