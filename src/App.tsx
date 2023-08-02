import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux/store';
import {
  getUserToken,
  getUserData,
  uploadFileRequest,
  getFiles,
} from './redux/data/dataSlice';
import { AuthButton } from './components/authBtn';

function App() {
  const dispacth = useAppDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');

  const { token, user, filesData, status, isLoading } = useAppSelector(
    (state) => state.userData
  );
  const [fileData, setData] = useState<File[]>([]);

  useEffect(() => {
    dispacth(getUserToken(code as string));
    dispacth(getFiles());
    dispacth(getUserData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, token]);

  useEffect(() => {
    dispacth(getUserData());
    dispacth(getFiles());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!user) {
    return (
      <div className="container">
        <div className="authBtn__container">
          <AuthButton />
        </div>
      </div>
    );
  }
  const uploadFile = () => {
    fileData.map((file) => {
      dispacth(uploadFileRequest(file));
    });
    setData([]);
  };

  return (
    <>
      <div className="container">
        <label htmlFor="file-upload" className="FileBtn">
          Выбрать файлы
          <input
            type="file"
            id="file-upload"
            multiple
            onChange={(e) => {
              const filesArray = Array.from(e.target.files as FileList);
              setData([...fileData, ...filesArray]);
            }}
          />
        </label>
        <div> files: {fileData.length}</div>

        <div className="uloadBlock">
          <button className="uploadBtn" onClick={uploadFile}>
            загрузить
          </button>

          {isLoading && <div>Loading...</div>}
        </div>

        <h1 className="title">Последние загруженные файлы</h1>
        <div className="lastFIlesContainer">
          {filesData?.items.map((file) => (
            <div className="lastFIlesContainerInfo">
              {file.media_type === 'image' ? (
                <img src={`${file?.preview}`} />
              ) : (
                <img
                  className="fileIcon"
                  src="https://cdn-icons-png.flaticon.com/512/118/118098.png"
                />
              )}

              <div className="FileName">{file.name}</div>

              <a className="downloadBtn" href={`${file.file}`}>
                Скачать
              </a>
            </div>
          ))}
        </div>
        <div></div>
      </div>
    </>
  );
}

export default App;
