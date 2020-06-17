import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { InputDialog } from '@jupyterlab/apputils';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { ILauncher } from '@jupyterlab/launcher';

import { IMainMenu } from '@jupyterlab/mainmenu';

import { LabIcon } from '@jupyterlab/ui-components';


import pythonIconStr from '../style/Python-logo-notext.svg';

// const FACTORY = 'Editor';
const PALETTE_CATEGORY = 'JupyterLab SWAN';

namespace CommandIDs {
  export const createNew = 'jlab-examples:create-new-python-file';
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'launcher',
  autoStart: true,
  requires: [IFileBrowserFactory],
  optional: [ILauncher, IMainMenu, ICommandPalette],
  activate: (
    app: JupyterFrontEnd,
    browserFactory: IFileBrowserFactory,
    launcher: ILauncher | null,
    menu: IMainMenu | null,
    palette: ICommandPalette | null
  ) => {
    const cmssw_options = ['CMSSW_12.0','CMSSW_11.0', 'CMSSW_10.1'];
    let cmssw_option = cmssw_options[0];

    const { commands } = app;
    const command = CommandIDs.createNew;
    const icon = new LabIcon({
      name: 'launcher:python-icon',
      svgstr: pythonIconStr
    });

    commands.addCommand(command, {
      label: args => (args['isPalette'] ? 'New CMSSW Env' : 'CMSSW Env'),
      caption: 'Create a new CMSSW Env',
      icon: args => (args['isPalette'] ? null : icon),
      execute: async args => {
        return InputDialog.getItem({
          title: 'Pick an option to persist by the State Example extension',
          items: cmssw_options,
          current: Math.max(0, cmssw_options.indexOf(cmssw_option))
        }).then(value => {
          console.log('selected item ' + value.value);
        });;
      }
    });

    // Add the command to the launcher
    if (launcher) {
      launcher.add({
        command,
        category: 'JupyterLab SWAN ',
        rank: 1
      });
    }

    // Add the command to the palette
    if (palette) {
      palette.addItem({
        command,
        args: { isPalette: true },
        category: PALETTE_CATEGORY
      });
    }

    // Add the command to the menu
    if (menu) {
      menu.fileMenu.newMenu.addGroup([{ command }], 30);
    }
  }
};

export default extension;
