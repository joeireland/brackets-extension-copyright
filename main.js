/*---------------------------------------------------------------------------------
* The MIT License (MIT)
* 
* Copyright (c) Tue May 12 2015 Joe Ireland
* 
* Permission is hereby granted,free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, includingwithout limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software isfurnished to do so,
* subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of theSoftware.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR APARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORTOR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*-------------------------------------------------------------------------------*/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets */

/**
 * A Brackets extension to insert copyright notices at the top of documents
 */
define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),
        Menus          = brackets.getModule("command/Menus"),
        Dialogs        = brackets.getModule("widgets/Dialogs"),
        DefaultDialogs = brackets.getModule("widgets/DefaultDialogs"),
        PrefManager    = brackets.getModule("preferences/PreferencesManager"),
        Preferences    = PrefManager.getExtensionPrefs("joeireland.copyright"),
        COMMAND_ID     = "joeireland.copyright",
        COMMAND_NAME   = "Insert Copyright",
        HOTKEY         = "Alt-C";

    function copyright() {
        var text  = Preferences.get("text");
        var author = Preferences.get("author");
        
        if (!author || !text || text.length === 0) {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, "Copyright Extension Configuration Error",
                                    'Select "Debug > Open Preferences File" and set the following configuration variables:<br><pre>' +
                                    '  "joeireland.copyright.author":     "author of the copyright"<br>' +
                                    '  "joeireland.copyright.text":       "The copyright text (uncommented)"<br>' +
                                    '  "joeireland.copyright.commentCmd": "edit.blockComment" or "edit.lineComment"</pre>');
            return;
        }
        
        var commentCmd = Preferences.get("commentCmd");

        if (!commentCmd) {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, "Copyright Extension Configuration Error",
                                    'The Copyright extension now comments your copyright text for you. You must remove ' +
                                    'your comment characters from the copyright text for this version of the extension<hr>' +
                                    'Select "Debug > Open Preferences File" and set the following configuration variables:<br><pre>' +
                                    '  "joeireland.copyright.author":     "author of the copyright"<br>' +
                                    '  "joeireland.copyright.text":       "The copyright text (uncommented)"<br>' +
                                    '  "joeireland.copyright.commentCmd": "edit.blockComment" or "edit.lineComment"</pre>');
            return;
        }

        var editor = EditorManager.getFocusedEditor();
        
        if (editor) {
            var today    = new Date().toDateString(),
                toInsert = "",
                i;
            
            for (i = 0; i < text.length; i++) {
                toInsert += text[i].replace("${DATE}", today).replace("${AUTHOR}", author) + "\n";
            }
            
            editor.document.replaceRange(toInsert, {line: 0, ch: 0});
            editor.setSelection({line: 0, ch: 0}, {line: text.length - 1, ch: text[text.length - 1].length}, true);
            CommandManager.execute(commentCmd);
            editor.setCursorPos({line: 0, ch: 0});
        }
    }
    
    var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    
    CommandManager.register(COMMAND_NAME, COMMAND_ID, copyright);
    editMenu.addMenuItem(COMMAND_ID, HOTKEY);
});
