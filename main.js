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
 * A Brackets extension to insert copyright notices at the top of documents
 */
define(function (require, exports, module) {
    "use strict";

    var CONST = {
            COMMAND_ID:   "joeireland.copyright",
            COMMAND_NAME: "Insert Copyright",
            DIALOG_TITLE: "Copyright Extension Configuration Error",
            NOT_CFG_MSG:  "You must configure the Copyright Extension before using it.",
            OLD_CFG_MSG:  "The Copyright extension now comments your text for you. " +
                          "You must remove all commenting characters before using it.",
            DATE_VAR:     "${DATE}",
            AUTHOR_VAR:   "${AUTHOR}",
            HOTKEY:       "Alt-C"
        },
        CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        Menus          = brackets.getModule("command/Menus"),
        Dialogs        = brackets.getModule("widgets/Dialogs"),
        DefaultDialogs = brackets.getModule("widgets/DefaultDialogs"),
        Config         = require("config/config"),
        config         = new Config();

    function copyright() {
        var data = config.get();
        
        switch (data.status) {
        case "not-configured":
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, CONST.DIALOG_TITLE, CONST.NOT_CFG_MSG);
            config.showPanel();
            return;
        case "no-command": // Backward compatibility for v1.0.1 which didn't use Brackets commenting commands.
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, CONST.DIALOG_TITLE, CONST.OLD_CFG_MSG);
            config.showPanel();
            return;
        }

        var editor = EditorManager.getFocusedEditor();
        
        if (editor) {
            editor.document.replaceRange(data.text + "\n", {line: 0, ch: 0});
            editor.setSelection({line: 0, ch: 0}, {line: data.length, ch: data.width}, true);
            CommandManager.execute(data.command).done(function () {
                editor.setCursorPos({line: 0, ch: 0});
            });
        }
    }
    
    var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    
    CommandManager.register(CONST.COMMAND_NAME, CONST.COMMAND_ID, copyright);
    editMenu.addMenuItem(CONST.COMMAND_ID, CONST.HOTKEY);
});
