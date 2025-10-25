---
layout: default # 引用 _layouts/default.html
---
 <div class="section" bind-json="legal"  id="service">
            <div class="container">
                <div class="has-text-centered">
              <div class="title is-2 mt-6" data-bind="json.service.title"></div>
              </div>
              <div class="subtitle is-4 mt-5" data-bind="json.service.description"></div>
              <div data-bind-for="json.service.subitems">
                <div class="title is-4 mt-3">{-item.index+1-}. {-item.title-}</div>
                <div class="subtitle is-5 mt-2">{-item.description-}</div>
              </div>
                 <div class="subtitle mt-5 mr-4 has-text-right" data-bind="json.service.update"></div>     
            </div>          
</div>