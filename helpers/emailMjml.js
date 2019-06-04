const mjml2html = require('mjml')

////    FUNC EMAIL MJML TO HTML    ////
const emailMjml = el =>
  mjml2html(`
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
              <mj-image src="${el.images[0]}"></mj-image>

              <mj-text color="#212b35" font-weight="bold" font-size="20px">
                ${el.title}
              </mj-text>
              <mj-text color="#637381" font-size="16px" font-style="italic">
                ${el.date}
              </mj-text>
              <mj-text color="#637381" font-size="16px">
                ${el.description}
              </mj-text>
            
              <mj-text font-size="16px">
                <a href="${el.link}" target="_blank">${el.link}</a>
              </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `)

module.exports = emailMjml
