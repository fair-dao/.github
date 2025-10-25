---
layout: default # 引用 _layouts/default.html
---
<div class="section" bind-json="/pages/zh/legal.json">
    <div class="container" id="privacy">
        <div class="title is-4" data-bind="json.privacy.title"></div>
        <div class="content" data-bind="json.privacy.description"></div>
        <div data-bind-for="json.privacy.subitems">
            <div class="title is-4 mt-3">{-item.index+1-}. {-item.title-}</div>
            <div class="subtitle is-5 mt-2">{-item.description-}</div>
        </div>
        <div class="subtitle mt-5 mr-4 has-text-right" data-bind="json.privacy.update"></div>     
    </div>
</div>  