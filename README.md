# Gamepad Tester（GitHub Pages版）

GitHubのリポジトリ直下に `index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg` をアップロードしてください。ZIPファイルのままアップロードしないでください。

Settings → Pages → Deploy from a branch → main / (root) → Save。公開URLは `https://ユーザー名.github.io/リポジトリ名/` です。

## 機能
- イラスト表示と数値表示の切替
- Xbox / Switch / PlayStation / その他の簡易レイアウト
- コントローラーIDから自動推定、手動選択と設定保存
- ボタン確認、軸の生データ、ドリフト測定、振動テスト（対応機種のみ）
- Service Workerによるオフラインキャッシュ

**注意:** Gamepad APIはブラウザやOSにより制限があります。表示タイプの切替は見た目の変更で、実機のボタン番号の変換ではありません。特に非標準マッピングでは表示が一致しない場合があります。
