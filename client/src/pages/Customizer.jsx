import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import {useSnapshot} from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
  const snap = useSnapshot(state);

  //show tab content depending on the activeTab
  //1:20:00 bakki type here
  
  return (
    <div>
      <AnimatePresence>
        {!snap.intro && (
          <>
            <motion.div
             key="custom"
             className='absolute top-80 left-0 z-10'
             {...slideAnimation('left')} 
            >
              <div className='flix item-center min-h-screen'>
                <div className='editortabs-container tabs'>
                  {EditorTabs.map((tab) => (
                    <Tab 
                      key={tab.name}
                      tab={tab}
                      handleClick={() => {}}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute z-10 top-5 right-5"
              {...fadeAnimation}
            >
              <CustomButton
                type="filled"
                title="Go back"
                handleClick={() => state.intro = true}
                cusustomStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </motion.div>

            <motion.div
              className='filtertabs-container'
              {...slideAnimation('up')}
            >
              {FilterTabs.map((tab) => (
                <Tab 
                  key={tab.name}
                  tab={tab}
                  isFilterTab
                  isActiveTab=""
                  handleClick={() => {}}
                />
              ))}            
             </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Customizer