/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint newline-per-chained-call: off */
/* eslint import/no-unresolved: off */
const { pipe } = require('@adobe/helix-pipeline/src/defaults/html.pipe.js');
const { logger } = require('@adobe/openwhisk-action-utils');

const jsonpipe = (cont, context, action) => {
    try {
        // action.params = action.params || {};
        action.logger = logger.init(action.params || {});
        action.logger.log = (level, ...params) => {
            try {
                return action.logger[level].call(action.logger, ...params);
            } catch (error) {
                console.debug('Error in log logger', error);
            }
        };
        action.logger.silly = (...params) => {
            try {
                return action.logger['debug'].call(action.logger, ...params);
            } catch (error) {
                console.debug('Error in silly logger', error);
            }
        };
        return pipe(cont, context, action);
    } catch(e) {
        console.log(e);
    }
    
};

module.exports.pipe = jsonpipe;