import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const types = ['image/png', 'image/jpeg'];

  const handleChange = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Please select an image file (png or jpg)');
    }
  };

//   const handleChange = (e) => {
//     for (let i = 0; i < e.target.files.length; i++) {
//         const newImage = e.target.files[i];
//         console.log(newImage)
//         newImage["id"] = Math.random();
//         setFile((prevState) => [...prevState, newImage]);
//     }
// };


  return (
    <form>
      {/* <label> */}
        <input type="file" onChange={handleChange} />
        {/* <span>+</span> */}
      {/* </label> */}
      <div className="output">
        { file && <div>{ file.name }</div> }
        { file && <ProgressBar file={file} setFile={setFile} /> }
      </div>


    </form>
     
  );
}


export default UploadForm;