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
          urlToLink(text, titlePatterns, replaceSelection);
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

const replaceSelection = (linkPart: LinkPart) => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (selectedText) {
      const linkText = getLinkFormat(editor, linkPart);
      if (linkText) {
        editor.edit((editBuilder) => {
          editBuilder.replace(selection, linkText);
        });
      }
    }
  }
};

const getLinkFormat: (
  editor: vscode.TextEditor,
  linkPart: LinkPart
) => string | undefined = (editor, linkPart) => {
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

  const linkFormat = linkFormats.find((linkFormat) => {
    linkFormat.languageId === languageId;
  });

  if (linkFormat === undefined) {
    vscode.window.showErrorMessage("No languages for link format found");
    return undefined;
  }

  return linkFormat.format
    .replace("${title}", linkPart.title)
    .replace("${url}", linkPart.url);
};
