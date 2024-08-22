/*トップページ。ひとまず簡易のログインボタンのみ*/
import React, { useEffect } from "react";

export const Logs = () => {

  return (
    <article className="pt-12 pb-12 max-w-[65%] m-auto">
      <div className="bg-white rounded p-[50px]">
        <div className="p-5">
          <section className="text-center">
            <div className="block mb-3">
              <h2 className="text-2xl font-semibold">Logs</h2>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
};

export default Logs;