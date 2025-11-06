---
layout: default # 引用 _layouts/default.html
---
 <section class="section">
          <div class="container" bind-json="trading">
            <div class="content has-text-centered mb-6">
              <h1 class="title is-4 has-text-primary" data-bind="json.trading"></h1>
            </div>
            <div class="content subtitle is-5 mt-2" data-bind="json.description"></div>
            <div>
              <div class="title is-4 mt-3">1. SunPUMP</div>
              <div class="subtitle is-5 mt-2"><a
                  href="https://sunpump.meme/token/TU6x2QQoiU6TU6iePvV9Kacv2fADvMT2F6"
                  data-bind="json.tradingNow"></a></div>
            </div>
            <div>
              <div class="title is-4 mt-3">2. Transit</div>
              <div class="subtitle is-5 mt-2"><a
                  href="https://swap.transit.finance/#/chart?chain=TRX&token=TU6x2QQoiU6TU6iePvV9Kacv2fADvMT2F6"
                  data-bind="json.tradingNow"></a></div>
            </div>
          </div>
</section>
