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

// import { DisposableSet } from '@lumino/disposable';


import cmsIconStr from '../style/CMS_logo.svg';

// import swanIconStr from '../style/SWAN_logo.svg';

// const FACTORY = 'Editor';
const PALETTE_CATEGORY = 'SWAN';

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
    const manager = app.serviceManager;
    //check the list of CMSSW environments available for every SCRAM ARCH ex:
    //source /cvmfs/cms.cern.ch/cmsset_default.sh
    //scram --arch slc7_amd64_gcc10 list CMSSW

    const scram_options = ['slc7_amd64_gcc820','slc7_amd64_gcc700','slc7_amd64_gcc630'];
    let scram_option = scram_options[0];

    let cmssw_options = ['Not Options Found'];
    let cmssw_option = cmssw_options[0];

    const { commands } = app;
    const command = CommandIDs.createNew;
    const cmsicon = new LabIcon({
      name: 'launcher:python-icon',
      svgstr: cmsIconStr
    });

    /* const swanicon = new LabIcon({
      name: 'launcher:python-icon',
      svgstr: swanIconStr
    });
 */
    commands.addCommand(command, {
      label: args => (args['isPalette'] ? 'New CMSSW Env' : 'CMSSW Env'),
      caption: 'Create a new CMSSW Env',
      icon: args => (args['isPalette'] ? null : cmsicon),
      execute: async args => {
        return InputDialog.getItem({
          title: 'Pick an SCRAM Version',
          items: scram_options,
          current: Math.max(0, scram_options.indexOf(scram_option))
        }).then(value => {
          console.log('selected item ' + value.value);
          if (value.value === 'slc7_amd64_gcc820')
          {
            cmssw_options=["CMSSW_11_0_0","CMSSW_10_6_0","CMSSW_10_5_0","CMSSW_10_4_0"]            
          }

          if(value.value === 'slc7_amd64_gcc700')
          {
            cmssw_options=["CMSSW_10_6_0","CMSSW_10_5_0","CMSSW_10_4_0","CMSSW_10_3_0","CMSSW_10_2_0","CMSSW_10_1_0","CMSSW_10_0_0"]
          }
          if(value.value === 'slc7_amd64_gcc630')
          {
            cmssw_options=["CMSSW_10_2_0","CMSSW_10_1_0","CMSSW_10_0_0","CMSSW_9_4_0","CMSSW_9_3_0","CMSSW_9_2_0","CMSSW_9_1_0","CMSSW_9_0_0"]
          }
          InputDialog.getItem({
            title: 'Pick an CMSSW Version',
            items: cmssw_options,
            current: Math.max(0, cmssw_options.indexOf(cmssw_option))
          }).then(value => {

            ///actions to execute witih the env HERE!
            console.log('selected item ' + value.value);
          });
        });

      }
    });

    // Add the command to the launcher
    if (launcher) {
      void manager.ready.then(() => {
        launcher.add({
          command,
          category: PALETTE_CATEGORY,
          rank: 1
        });
      })
    }

    // Add the command to the palette
    if (palette) {
      palette.addItem({
        command,
        args: { isPalette: true},
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
