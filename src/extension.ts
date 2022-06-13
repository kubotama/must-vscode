// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from "axios";

import { JSDOM } from "jsdom";

import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export const activate = (context: vscode.ExtensionContext) => {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "must-vscode.urlToLink",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        const document = editor.document;
        const text = document.getText(selection);
        if (text) {
          urlToLink(text).then((link) => {
            editor.edit((editBuilder) => {
              editBuilder.replace(selection, link);
            });
          });
        }
      }
    }
  );

  context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
export const deactivate = () => {};

export const urlToLink = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const title = dom.window.document.title;
    return `[${title}](${url})`;
  } catch (error) {
    return url;
  }
};
