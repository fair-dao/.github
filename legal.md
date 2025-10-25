---
layout: default # 引用 _layouts/default.html
---
<div class="section" bind-json="/pages/zh/legal.json">
    <div class="section" id="serviceagreement" data-bind="json.serviceagreement"></div>
    <div class="section" id="privacy">
    <div class="title is-4" data-bind="json.privacy.title"></div>
    <div class="content" data-bind="json.privacy.description"></div>
    <div data-bind-for="json.privacy.subitems">
        <div class="title is-4" data-bind="item.title"></div>
        <div class="content" data-bind="item.description"></div>
    </div>
</div>
<div class="section has-background-light"  id="disclaimers" data-bind="json.disclaimers">
</div>

</div>