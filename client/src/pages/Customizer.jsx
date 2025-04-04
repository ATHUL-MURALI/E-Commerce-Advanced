import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download, logoShirt } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

// export const AddVton = 0;// my variable to check if the admin page is loaded from 3d site

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />;
      case 'filepicker':
        return (
          <FilePicker
            file={file}
            setFile={setFile}
            readFile={readFile}
          />
        );
      case 'aipicker':
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) return alert('Please enter a prompt');

    try {
      setGeneratingImg(true);

      const response = await fetch('http://127.0.0.1:8000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const imageUrl = `data:image/png;base64,${data.image}`;

      handleDecals(type, imageUrl); // Pass the image URL to the decals handler
    } catch (error) {
      alert(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab('');
    }
  };

  // const handleDecals = (type, result) => {
  //   const decalType = DecalTypes[type];

  //   state[decalType.stateProperty] = result;

  //   if (!activeFilterTab[decalType.filterTab]) {
  //     handleActiveFilterTab(decalType.filterTab);
  //   }
  // };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
  
    state[decalType.stateProperty] = result;
  
    imageDataStore.ImgData = result; // <-- Save image globally
  
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };


  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case 'logoShirt':
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case 'stylishShirt':
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab('');
    });
  };

  return (
    <div>
      <AnimatePresence>
        {!snap.intro && (
          <>
            <motion.div
              key="custom"
              className="absolute top-0 left-0 z-10"
              {...slideAnimation('left')}
            >
              <div className="flex items-center min-h-screen">
                <div className="editortabs-container tabs">
                  {EditorTabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      tab={tab}
                      handleClick={() => setActiveEditorTab(tab.name)}
                    />
                  ))}

                  {generateTabContent()}
                </div>
              </div>
            </motion.div>

            <motion.div className="absolute z-10 top-5 right-5" {...fadeAnimation}>
              <CustomButton
                type="filled"
                title="Go back"
                handleClick={() => (state.intro = true)}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </motion.div>

            <motion.div className="filtertabs-container" {...slideAnimation('up')}>
              {FilterTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  tab={tab}
                  isFilterTab
                  isActiveTab={activeFilterTab[tab.name]}
                  handleClick={() => handleActiveFilterTab(tab.name)}
                />
              ))}
            </motion.div>
{/*Download button                                                                                                           */}
            {/* <div className="canvas-container relative">
            <button className='download-btn absolute bottom-4 right-4 bg-white p-2 rounded shadow z-50'
              onClick={downloadCanvasToImage}>
              <img
                src={download}
                alt='download_image'
                className='w-3/5 h-3/5 object-contain'
              />
            </button>
            </div> */}

            <div className="canvas-container relative">
              <button
                className='download-btn absolute bottom-4 right-4 bg-white p-2 rounded shadow z-50'
                onClick={() => {
                  downloadCanvasToImage();

                  // Optionally store canvas snapshot here too if needed
                  // For now, we already have image saved to imageDataStore.ImgData

                  window.location.href = 'http://localhost:5174/add';
                }}
              >
                <img
                  src={download}
                  alt='download_image'
                  className='w-3/5 h-3/5 object-contain'
                />
              </button>
            </div>

{/*Download button                                                                                                         */}
          </>      
        )}
      </AnimatePresence>
    </div>    
  );
};  

export default Customizer;


