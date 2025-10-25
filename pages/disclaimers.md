         <div class="section" bind-json="legal" id="disclaimers">         
            <div class="container">
                <div class="has-text-centered">
              <div class="title is-2 mt-6" data-bind="json.disclaimers.title"></div>              
              </div>          
              <div data-bind-for="json.disclaimers.subitems">
                <div class="subtitle is-4 mt-3">{-item.index+1-}. {-item.description-}</div>
              </div>                   
            </div>
          </div>