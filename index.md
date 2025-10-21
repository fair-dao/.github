---
layout: default  # 引用 _layouts/default.html
---
<section class="section">
        <div class="container">
            <div class="columns is-centered" bind-json="/pages/index/time">
                <div class="column is-10">
                    <div class="content has-text-centered mb-6">
                        <h1 class="title is-2 has-text-primary" bind-data="json.title"></h1>
                    </div>                    
                    <div class="timeline">
                        <!-- 时间线项目1 -->
                        <div class="timeline-item" bind-for="json.items">
                            <div class="timeline-icon">
                                <i class="{{item.icon}}"></i>
                            </div>
                            <div class="columns">
                                <div class="column is-6" bind-if="{{item.index}} %2==1">
                                    <!-- 右侧内容留空，形成交替布局 -->
                                </div>
                                <div class="column is-6">
                                    <div class="timeline-content">
                                        <div class="timeline-date">{{item.time}}</div>
                                        <h3 class="timeline-title">{{item.title}}</h3>
                                        <p class="timeline-description">{{item.description}}</p>
                                        <div class="tags mt-3">
                                            <span class="tag is-primary">里程碑</span>
                                            <span class="tag is-info">规划</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="column is-6" bind-if="{{item.index}} %2==0">
                                    <!-- 右侧内容留空，形成交替布局 -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</section>

      <div class="items" data-bind-for="worker-items">
                        <div class="item">
                            <div class="item-title is-size-4">{{worker-items.name}}</div>
                            <div class="item-des">{{worker-items.des}}</div>
                        </div>
                    </div>