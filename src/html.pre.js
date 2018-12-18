/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const VDOM = require('@adobe/helix-pipeline').utils.vdom;

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param payload The current payload of processing pipeline
 * @param payload.content The content
 */
function pre(payload, action) {
  payload.content.time = `${new Date()}`;

  // convert sections to vdoms
  const c = payload.content;
  c.sectionsDocuments = [];

  let previous;
  let parity = false;

  c.sections.forEach((element, index) => {
    const transformer = new VDOM(element, action.secrets);
    let node = transformer.process();

    const types = element.types.slice();
    types.push(`index${index}`);

    // "state machine"
    if (previous) {

      // if 2 consecutive paragraphs contain an (image and a paragraph) OR (2 images), put them on the same "row"
      if (
        !types.includes('index0') && 
        (types.includes('has-paragraph') || types.includes('nb-image-2')) &&
        types.includes('has-image') && 
        (previous.className.includes('has-paragraph') || previous.className.includes('nb-image-2')) &&
        previous.className.includes('has-image') &&
        !previous.className.includes('left')) {

          previous.classList.add('left');
          node.classList.add('right');

          // cancel parity
          parity = !parity;
      } else {
        if (
          // if list only and no heading -> carousel
          types.includes('is-list-only') &&
          !types.includes('has-heading')) {

          //node.classList.add('carousel');

          const carousel = node;

          node = transformer.getDocument().createElement('div');
          node.classList.add('carousel');

          node.innerHTML = carousel.outerHTML;

          const controlDiv = transformer.getDocument().createElement('div');
          controlDiv.classList.add('carousel-control');
          controlDiv.innerHTML = '<i class ="fa fa-angle-left fa-2x" id="carousel-l"></i><i class = "fa fa-angle-right fa-2x" id="carousel-r"></i>';

          node.appendChild(controlDiv);
        }
      }

    }

    types.push(parity ? 'even' : 'odd');
    types.push('section');
    // add types as css class
    types.forEach(t => {
      node.classList.add(t);
    });

    parity = !parity;

    previous = node;
    c.sectionsDocuments.push(node);
  });

}

module.exports.pre = pre;
