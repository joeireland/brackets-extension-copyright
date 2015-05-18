/*
The MIT License (MIT)

Copyright (c) Sun May 17 2015 Joe Ireland

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORTOR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

/**
 * Copyright Configuration
 */
define(function (require, exports, module) {
    "use strict";

    var CONST = {
            PANEL_ID:         "joeireland-copyright-panel",
            BUTTON_ID:        "joeireland-copyright-btn",
            CLOSE_ID:         "joeireland-copyright-close",
            SAVE_ID:          "joeireland-copyright-save",
            AUTHOR_ID:        "joeireland-copyright-author",
            COMMENT_CMD_ID:   "joeireland-copyright-commentCmd",
            TEXT_ID:          "joeireland-copyright-text",
            DATE_VAR:         "${DATE}",
            AUTHOR_VAR:       "${AUTHOR}",
            AUTHOR_PREF:      "author",
            COMMENT_CMD_PREF: "commentCmd",
            TEXT_PREF:        "text"
        },
        WorkspaceManager = brackets.getModule("view/WorkspaceManager"),
        ExtensionUtils   = brackets.getModule("utils/ExtensionUtils"),
        Resizer          = brackets.getModule("utils/Resizer"),
        PrefManager      = brackets.getModule("preferences/PreferencesManager"),
        Preferences      = PrefManager.getExtensionPrefs("joeireland.copyright"),
        DefaultLicense   = require("text!./text/default-license.txt"),
        Panel            = require("text!./html/panel.html"),
        Button           = require("text!./html/button.html"),
        $button,
        $panel;

    /**
    * Constructor to create Copyright Config manager.
    *
    * @constructor
    */
    function Config() {
        ExtensionUtils.loadStyleSheet(module, "css/main.less");

        $("#main-toolbar .buttons").append(Button);
        $button = $("#" + CONST.BUTTON_ID).on("click", this.togglePanel.bind(this));

        WorkspaceManager.createBottomPanel(CONST.PANEL_ID, $(Panel), 600);
        $panel = $("#" + CONST.PANEL_ID);
        $("#" + CONST.CLOSE_ID).on("click", this.togglePanel.bind(this));
        $("#" + CONST.SAVE_ID).on("click", this.save.bind(this));
    }

    Config.prototype.get = function () {
        var author  = Preferences.get(CONST.AUTHOR_PREF),
            command = Preferences.get(CONST.COMMENT_CMD_PREF),
            lines   = Preferences.get(CONST.TEXT_PREF);

        if (!author || this.isTextUnset(lines)) {
            return {status: "not-configured"};
        } else if (!command) {
            return {status: "no-command"};
        }

        var today  = new Date().toDateString(),
            length = lines.length - 1,
            width  = lines[length].length,
            text   = lines.join("\n")
                          .replace(CONST.DATE_VAR, today)
                          .replace(CONST.AUTHOR_VAR, author);

        return { text: text, command: command, length: length, width: width, status: "ok" };
    };

    Config.prototype.save = function () {
        Preferences.set(CONST.AUTHOR_PREF, $("#" + CONST.AUTHOR_ID).val());
        Preferences.set(CONST.COMMENT_CMD_PREF, $("#" + CONST.COMMENT_CMD_ID).val());
        Preferences.set(CONST.TEXT_PREF, $("#" + CONST.TEXT_ID).val().split("\n"));
        this.togglePanel();
    };

    Config.prototype.update = function () {
        var author  = Preferences.get(CONST.AUTHOR_PREF);
        var command = Preferences.get(CONST.COMMENT_CMD_PREF);
        var text    = Preferences.get(CONST.TEXT_PREF);

        if (!command) {
            command = "edit.blockComment";
        }

        if (this.isTextUnset(text)) {
            text = DefaultLicense;
        } else {
            text = text.join("\n");
        }

        $("#" + CONST.AUTHOR_ID).val(author);
        $("#" + CONST.COMMENT_CMD_ID).val(command);
        $("#" + CONST.TEXT_ID).val(text);
    };

    Config.prototype.showPanel = function () {
        if (!$button.hasClass("active")) {
            this.togglePanel();
        }
    };

    Config.prototype.togglePanel = function () {
        Resizer.toggle($panel);
        $button.toggleClass("active");

        if ($button.hasClass("active")) {
            this.update();
        }
    };

    Config.prototype.isTextUnset = function (text) {
        return !text || text.length === 0 || (text.length === 1 && text[0].length === 0);
    };

    module.exports = Config;
});
