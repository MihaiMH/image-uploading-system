import './App.css';
import Axios from "axios";
import { useState, useEffect } from 'react';

function App() {
  const [image, setImage] = useState("");
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [edit, setEdit] = useState("");



  // Change the image when a new file is selected
  const onChangeImage = e => {
    setImage(e.target.files[0]);
  }


  // Fetch all the images from the server when the windows reloads
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      await Axios.get("http://localhost:3001/getImages").then(
        (response) => {
          if (response.data != "ERROR") {
            setImages(response.data);
            console.log(response.data);
          }
        }
      )
      setLoading(false);
    }

    fetchImages();
  }, [])


  // Upload an image to the server
  const insertImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    const insertImg = async () => {
      setLoading(true);
      await Axios.post("http://localhost:3001/uploadImage", formData).then((
        response
      ) => {
        if (response.data === "SUCCESS") {
          alert("Your image has been successfully uploaded");
        } else {
          alert("An error has occured! Please try again.");
        }
      })
      window.location.reload();
      setLoading(false);
    }

    insertImg();

  }


  // Delete an image
  function deleteImage(link) {
    const deleteImg = async () => {
      setLoading(true);
      await Axios.post("http://localhost:3001/deleteImage", { file_name: link }).then(
        (response) => {
          if (response.data === "SUCCESS") {
            alert("The image has been deleted successfully");
          } else {
            alert("An error has occured! Please try again.")
          }
        }
      )
      setLoading(false);
      window.location.reload();
    }

    deleteImg();
  }

  // Replace an image
  function replaceImage(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("file_name", edit);
    const replaceImg = async () => {
      setLoad(true);
      await Axios.post("http://localhost:3001/replaceImage", formData).then(
        (response) => {
          if (response.data === "SUCCESS") {
            alert("The image has been replaced successfully");
          } else {
            alert("An error has occured! Please try again.")
          }
        }
      )
      window.location.reload();
      setLoad(false);
    }

    replaceImg();
  }


  return (
    <>
      {loading === false ?
        <div className="container-fluid">
          <div className="d-flex flex-column align-items-center">
            <form className="card m-5 p-5 card-form" onSubmit={insertImage} encType="multipart/form-data">
              <h1>Image Uploading Website</h1>
              <p>By Mihai Mihaila</p>
              <label className="form-label" htmlFor="image">Your image:</label>
              <input name="image" filename="image" className="form-control card-form-input" type="file" value={image.filename} onChange={onChangeImage} placeholder="Image" required />
              <br></br>
              {load === false ? <button className="btn btn-primary card-form-btn" type="submit">Submit</button> : <><button className="btn btn-primary card-form-btn disabled" disabled>Loading...</button></>}
            </form>
          </div>
          <>
            {images.length > 0 ?
              <div className="images">
                {
                  images.map((img) =>
                    <>

                      <div className="card m-2 p-5 card-form d-flex flex-column align-items-center custom-width-1">
                        <img src={img} />
                        {edit != img ?
                          <>
                            <button className='btn btn-secondary card-form-btn mt-1' onClick={() => { deleteImage(img) }}>Delete</button>
                            <button className='btn btn-info card-form-btn mt-1' onClick={() => { navigator.clipboard.writeText(img); alert("Link copied to clipboard") }}>Copy link</button>
                            <button className='btn btn-warning card-form-btn mt-1' onClick={() => { setEdit(img) }}>Replace image</button>
                          </>
                          :
                          <form className="card m-5 p-5 card-form d-flex flex-column custom-width-2" onSubmit={replaceImage} encType="multipart/form-data">
                            <label className="form-label" htmlFor="image">New image:</label>
                            <input name="image" filename="image" className="form-control card-form-input" type="file" value={image.filename} onChange={onChangeImage} placeholder="Image" required />
                            <br></br>
                            {load === false ?
                              <>
                                <button className="btn btn-primary card-form-btn " type="submit">Submit</button>
                                <button className='btn btn-secondary card-form-btn mt-1' onClick={() => { setEdit("") }}>Cancel</button>
                              </>
                              :
                              <><button className="btn btn-primary card-form-btn disabled" disabled>Loading...</button></>
                            }
                          </form>
                        }
                      </div>


                    </>
                  )
                }
              </div>
              :
              <p>No images</p>
            }
          </>
        </div>
        :
        <></>
      }
    </>
  );
}

export default App;
