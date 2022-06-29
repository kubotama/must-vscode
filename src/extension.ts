// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { link } from "fs";
import * as vscode from "vscode";

import { urlToLink, TitlePattern, UrlPattern } from "./link";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export const activate = (context: vscode.ExtensionContext) => {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const linkDisposable = vscode.commands.registerCommand(
    "must-vscode.urlToLink",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        const document = editor.document;
        const titlePatterns = getTitlePatterns();
        const urlPatterns = getUrlPatterns();

        const text = document.getText(selection);
        const linkFormat = getLinkFormat(editor);
        // if exists selected text
        if (text && linkFormat) {
          urlToLink(text, titlePatterns, urlPatterns, linkFormat)
            .then((linkText) => {
              replaceSelection(linkText);
            })
            .catch((error) => {
              vscode.window.showErrorMessage("Invalid URL.");
            });
        }
      }
    }
  );

  context.subscriptions.push(linkDisposable);

  const selectDisposable = vscode.commands.registerCommand(
    "must-vscode.selectUrl",
    () => {
      const editor = vscode.window.activeTextEditor;
      const urlRegex = getUrlRegex();
      if (editor && urlRegex) {
        const selected = editor.document.getWordRangeAtPosition(
          editor.selection.active,
          new RegExp(urlRegex)
        );
        if (selected) {
          editor.selection = new vscode.Selection(selected.start, selected.end);
        } else {
          vscode.window.showErrorMessage("Can't select URL.");
        }
      }
    }
  );

  context.subscriptions.push(selectDisposable);
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

const getUrlPatterns: () => UrlPattern[] = () => {
  const config = vscode.workspace.getConfiguration("must-vscode");
  const urlPatterns: UrlPattern[] | undefined = config.get("urlPatterns");

  if (urlPatterns) {
    return urlPatterns;
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

  const linkFormat = linkFormats.find(
    (linkFormat) => linkFormat.languageId === languageId
  );

  if (linkFormat) {
    return linkFormat.format;
  }

  vscode.window.showErrorMessage("No languages for link format found");
  return undefined;
};

const getUrlRegex: () => string | undefined = () => {
  const config = vscode.workspace.getConfiguration("must-vscode");
  const urlRegex: string | undefined = config.get("urlRegex");
  return urlRegex;
};
