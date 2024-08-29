# Interview Simulator R

<p align="left">
  <img src="https://img.shields.io/badge/Rails-D30001?logo=rubyonrails&style=flat">
  <img src="https://img.shields.io/badge/React-555?logo=react&style=popout">
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&style=flat">
  <img src="https://img.shields.io/badge/DaisyUI-5A0EF8?logo=daisyui&style=flat">
  <img src="https://img.shields.io/badge/MySQL-4479A1?logo=mysql&style=flat">
  <img src="https://img.shields.io/badge/Heroku-430098?logo=heroku&style=flat">
  <img src="https://img.shields.io/badge/Docker-555?logo=docker&style=popout">
  <img src="https://img.shields.io/badge/GitHub-181717?logo=github&style=popout">
  <img src="https://img.shields.io/badge/OpenAI-412991?logo=openai&style=flat">
</p>

![Interview Simulator R](https://github.com/user-attachments/assets/e4368579-337a-4dc4-b98b-21e70f934bc1)


## 概要

Interview Simulator 2 は、エンジニア面接に向けた包括的な準備を支援するAI駆動型アプリケーションです。
リアルな面接環境をシミュレートし、パーソナライズされたフィードバックを提供することで、未経験エンジニアや転職を考えているジュニアエンジニアの皆様の面接スキル向上をサポートします。

## 目的と対象ユーザー

### 主な目的
- エンジニア面接の準備を効果的に支援
- リアルな面接体験を通じて自信を構築
- 個別化されたフィードバックによるスキル向上

### ターゲットユーザー
- 未経験エンジニア
- 転職を希望するジュニアエンジニア
- テクニカルインタビューの練習を求める学生

## 主要機能

### 1. AIによる音声ベースの面接シミュレーション
- リアルな面接官との対話を再現
- 動的な質問生成で、自然な会話の流れを実現

### 2. GitHubレポジトリ分析によるパーソナライズド面接
- ユーザーのGitHubプロフィールを分析し、カスタマイズされた質問を生成

### 3. 面接の文字起こしと分析
- 面接内容を自動的にテキスト化

### 4. AIによる面接評価とフィードバック
- 回答の質、デリバリー、技術的正確性などを評価
- 改善点や強みを詳細にフィードバック

### 5. 履歴管理
- 過去の面接シミュレーションを保存・閲覧可能
- 成長の軌跡を可視化

### 追加予定
- 複数の面接担当者アバター
- 難易度設定（新卒、ジュニア、シニアなど）
- 面接テクニックや一般的な質問へのヒント集

### 実装を取りやめたこと
- 面接体験談投稿などのSNS機能（個人情報や個別企業に関する投稿にコンプライアンスリスクがあるため）

## 技術スタック

### フロントエンド
- React.js
- Tailwind CSS, DaisyUI

### バックエンド
- Ruby on Rails

### データベース
- MySQL（ユーザーデータ、面接履歴）

### AI/ML
- OpenAI API (GPT-4o-mini, Text to Speech, Speech to Text)

### インフラ
- Docker
- Heroku

### CI/CD
- GitHub Actions

### モニタリング
- Google Analytics

## 特徴

- **マルチモーダルAI**: テキスト、音声、動画を組み合わせた没入型体験
- **リアルタイムフィードバック**: 面接中の回答に対するリアルタイム評価
- **データ駆動型改善**: ユーザーの成長を追跡し、パーソナライズされた学習パスを提供


## 画面遷移図
https://www.figma.com/design/YuKTnRlGQcBJ6kirSLq0jt/interviewSimulator2?node-id=0-1&t=1mzIDhm9C7DO4xgd-1

## ER図
https://app.diagrams.net/#HMaTTalv001%2FInterview_simulator2%2Fmain%2Finterview_simulator2.drawio#%7B%22pageId%22%3A%228JCcPIpRCuSTkeoywtW6%22%7D

## for Developers
### インストールと使用方法

1. リポジトリをクローン:
git clone https://github.com/MaTTalv001/Interview_simulator2.git

2. `.env.local`に環境変数を設定

```
GITHUB_KEY=xxxxxxxxxxxxxx(Github OAuth Apps)
GITHUB_SECRET=xxxxxxxxxxxxx(Github OAuth Apps)
JWT_SECRET_KEY=xxxxxxxxxxxxx(任意のもの)
GITHUB_ACCESS_TOKEN=xxxxxxxxxxxxx(Github Personal access tokens)
REACT_APP_API_URL=http://localhost:8000
FRONT_URL=http://localhost:8000
OPENAI_API=xxxxxxxxxxxxx
```

3. ビルドと立ち上げ:
```
docker compose build
```
```
docker compose up
```
4. データベース構築:
```
docker compoe exec back bash
```
```
rails db:create
rails db:migrate
rails db:seed
```
5. CI/CD設定（不要ならディレクトリごと削除）:

- `.github`以下にGithub Actions設定
- テンプレートはheroku用

6. プレビュー
`localhost:8000`
