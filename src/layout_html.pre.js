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
const htmlpre = require('./html.pre.js');
const beautifyhtml = require('js-beautify').html;
const stringify = require('remark-stringify')

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param payload The current payload of processing pipeline
 * @param payload.content The content
 */
function pre(payload, action) {
  htmlpre.pre(payload, action);
  const c = payload.content;
  c.sectionsLayouts = [];
  
  c.sectionsDocuments.forEach((section, index) => {
    c.sectionsLayouts.push({
      index: index,
      types: c.sections[index].types,
      md: new stringify.Compiler().visit(c.sections[index]).replace(/</g, '&#60;'),
      html: beautifyhtml(section.outerHTML).replace(/</g, '&#60;'),
      childrenTypes: c.sections[index].childrenTypes || []
    });
  });
}

module.exports.pre = pre;
