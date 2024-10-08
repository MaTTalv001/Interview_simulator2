import React from 'react';

export const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto mt-10 p-4 max-w-3xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl mb-6">プライバシーポリシー
          </h1>
          
          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-3">お客様から取得する情報</h2>
            <p>当社は、お客様から以下の情報を取得します。</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>氏名(ニックネームやペンネームも含む)</li>
              <li>年齢または生年月日</li>
              <li>性別</li>
              <li>職業、職歴、学歴</li>
              <li>メールアドレス</li>
              <li>外部サービスでお客様が利用するID、その他外部サービスのプライバシー設定によりお客様が連携先に開示を認めた情報</li>
              <li>Cookie(クッキー)を用いて生成された識別情報</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-3">お客様の情報を利用する目的</h2>
            <p>当社は、お客様から取得した情報を、以下の目的のために利用します。</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>当社サービスに関する登録の受付、お客様の本人確認、認証のため</li>
              <li>お客様の当社サービスの利用履歴を管理するため</li>
              <li>当社サービスにおけるお客様の行動履歴を分析し、当社サービスの維持改善に役立てるため</li>
              <li>当社のサービスに関するご案内をするため</li>
              <li>お客様からのお問い合わせに対応するため</li>
              <li>当社の規約や法令に違反する行為に対応するため</li>
              <li>当社サービスの変更、提供中止、終了、契約解除をご連絡するため</li>
              <li>当社規約の変更等を通知するため</li>
              <li>以上の他、当社サービスの提供、維持、保護及び改善のため</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-3">安全管理のために講じた措置</h2>
            <p>当社が、お客様から取得した情報に関して安全管理のために講じた措置につきましては、末尾記載のお問い合わせ先にご連絡をいただきましたら、法令の定めに従い個別にご回答させていただきます。</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-3">第三者提供</h2>
            <p>当社は、お客様から取得する情報のうち、個人データ（個人情報保護法第１６条第３項）に該当するものついては、あらかじめお客様の同意を得ずに、第三者（日本国外にある者を含みます。）に提供しません。 但し、次の場合は除きます。</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>個人データの取扱いを外部に委託する場合</li>
              <li>当社や当社サービスが買収された場合</li>
              <li>事業パートナーと共同利用する場合（具体的な共同利用がある場合は、その内容を別途公表します。）</li>
              <li>その他、法律によって合法的に第三者提供が許されている場合</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-3">アクセス解析ツール</h2>
            <p>当社は、お客様のアクセス解析のために、「Googleアナリティクス」を利用しています。Googleアナリティクスは、トラフィックデータの収集のためにCookieを使用しています。トラフィックデータは匿名で収集されており、個人を特定するものではありません。Cookieを無効にすれば、これらの情報の収集を拒否することができます。詳しくはお使いのブラウザの設定をご確認ください。Googleアナリティクスについて、詳しくは以下からご確認ください。</p>
            <p className="mt-2"><a href="https://marketingplatform.google.com/about/analytics/terms/jp/" className="link link-primary" target="_blank" rel="noopener noreferrer">https://marketingplatform.google.com/about/analytics/terms/jp/</a></p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-3">プライバシーポリシーの変更</h2>
            <p>当社は、必要に応じて、このプライバシーポリシーの内容を変更します。この場合、変更後のプライバシーポリシーの施行時期と内容を適切な方法により周知または通知します。</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-3">お問い合わせ</h2>
            <p>お客様の情報の開示、情報の訂正、利用停止、削除をご希望の場合は、ご連絡ください。</p>
            <p className="mt-2">この場合、必ず、運転免許証のご提示等当社が指定する方法により、ご本人からのご請求であることの確認をさせていただきます。なお、情報の開示請求については、開示の有無に関わらず、ご申請時に一件あたり1,000円の事務手数料を申し受けます。</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold mb-3">事業者情報</h2>
            <p><strong>事業者の氏名:</strong> MaTTa</p>
            <p><strong>事業者の住所:</strong> 大阪</p>
            <p><strong>制定日:</strong> 2024年08月28日</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;