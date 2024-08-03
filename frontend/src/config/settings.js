
/*環境変数 REACT_APP_API_URL から API のベース URL を取得しつつデフォルト値も設定しておく*/
export const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://interview-frontend-05a5d7363eca.herokuapp.com";