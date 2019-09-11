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

const jquery = require('jquery');

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param payload The current payload of processing pipeline
 * @param payload.content The content
 */
function pre(context, action) {
  context.content.time = `${new Date()}`;

  const { document } = context.content;
  const $ = jquery(document.defaultView);

  // convert sections to vdoms
  // const c = payload.content;
  // c.sectionsDocuments = [];

  let previous;
  let parity = false;

  const $sections = $(document.body).children('div');

  $sections.each((index, section) => {
    
    const types = (section.dataset.hlxTypes || '').split(' ');

    types.push(`index${index}`);

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
          section.classList.add('right');

          // cancel parity
          parity = !parity;
      } else {
        if (
          // if list only and no heading -> carousel
          types.includes('is-list-only') &&
          !types.includes('has-heading')) {

          // const carousel = section;

          // const node = document.createElement('div');
          // node.classList.add('carousel');

          // node.innerHTML = carousel.outerHTML;

          // const controlDiv = transformer.getDocument().createElement('div');
          // controlDiv.classList.add('carousel-control');
          // controlDiv.innerHTML = '<i class ="fa fa-angle-left fa-2x" id="carousel-l"></i><i class = "fa fa-angle-right fa-2x" id="carousel-r"></i>';

          // node.appendChild(section.parent);
        }
      }

    }

    types.push(parity ? 'even' : 'odd');
    types.push('section');
    // add types as css class
    types.forEach(t => {
      section.classList.add(t);
    });

    section.dataset.hlxTypes = types;

    parity = !parity;

    previous = section;

  });
}

module.exports.pre = pre;
