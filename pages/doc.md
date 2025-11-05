---
layout: default # 引用 _layouts/default.html
---
 <div class="section" bind-json="doc"  id="doc">
            <div class="container">
                <div class="has-text-centered">
              <div class="title is-2 mt-6" data-bind="json.title"></div>
              </div>
              <div class="subtitle is-4 mt-5" data-bind="json.description"></div>
              <div data-bind-for="json.subitems">
                <div class="title is-4 mt-3"><a href="{-item.link-}">{-item.index+1-}. {-item.title-}</a></div>
                <div class="subtitle is-5 mt-2">{-item.description-}</div>
              </div>                 
            </div>          
</div>