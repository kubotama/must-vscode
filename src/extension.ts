// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { urlToLink, TitlePattern } from "./link";

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
        const titlePatterns = getTitlePatterns();

        // if exists selected text
        if (text) {
          const linkFormat = getLinkFormat(editor);
          if (linkFormat) {
            urlToLink(text, titlePatterns, linkFormat, replaceSelection);
          }
        }
      }
    }
  );

  context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
export const deactivate = () => {};

const getTitlePatterns: () => TitlePattern[] = () => {
  const config = vscode.workspace.getConfiguration("must-vscode");
  const titlePatterns: TitlePattern[] | undefined = config.get("titlePatterns");

  if (titlePatterns) {
    return titlePatterns;
  }
  return [];
};

export type LinkPart = {
  title: string;
  url: string;
};

const replaceSelection = (text: string) => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (selectedText) {
      if (text) {
        editor.edit((editBuilder) => {
          editBuilder.replace(selection, text);
        });
      }
    }
  }
};

const getLinkFormat: (editor: vscode.TextEditor) => string | undefined = (
  editor
) => {
  const languageId = editor.document.languageId;
  if (!languageId) {
    return undefined;
  }

  const config = vscode.workspace.getConfiguration("must-vscode");
  const linkFormats: { languageId: string; format: string }[] | undefined =
    config.get("linkFormats");

  if (linkFormats === undefined) {
    vscode.window.showErrorMessage("No link format found");
    return undefined;
  }

  for (const linkFormat of linkFormats) {
    if (linkFormat.languageId === languageId) {
      return linkFormat.format;
    }
  }

  vscode.window.showErrorMessage("No languages for link format found");
  return undefined;
};
