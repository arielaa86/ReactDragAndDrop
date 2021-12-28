import React, {useState} from 'react';
import styles from "./DropBox.module.scss";

export type DropBoxFolder = {
    name: string | undefined;
    files: File[];
}

export const DropBox = () => {

    const [folders, setFolders] = useState<DropBoxFolder[]>([])
    const [selectedFolder, setSelectedFolder] = useState<DropBoxFolder>()

    const onDragOver = (ev: any) => {
        let event = ev as Event;
        event.stopPropagation();
        event.preventDefault();
    }

    const onDrop = (ev: any) => {
        ev.preventDefault();
        if (ev.dataTransfer.items) {
            [...ev.dataTransfer.items].forEach(item => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    addToFolder(file)
                }
            })
        }
    }

    const addToFolder = (file: File) => {

        const fileExtension: string | undefined = file.name.split('.').pop();
        const index = folders.findIndex(folder => folder.name === fileExtension?.toLocaleUpperCase())

        if (index === -1) {
            const newFolder: DropBoxFolder = {name: fileExtension?.toLocaleUpperCase(), files: []}
            newFolder.files = [...newFolder.files, file]
            setFolders([...folders, newFolder])
        } else {
            const folderCopy = [...folders]
            folderCopy[index].files = [...folders[index].files, file]
            setFolders(folderCopy)
        }

    }

    const selectFolder = (folderName: string | undefined) => {
        setSelectedFolder(folders.find(folder => folder.name === folderName))
    }

    return (
        <div className={styles.container}>
            <div className={styles.dropArea} onDrop={onDrop} onDragOver={onDragOver}>
                {folders.map((folder, index) =>
                    <Folder key={`folder-${index}`} folder={folder} onClick={() => selectFolder(folder.name)}/>
                )}
            </div>
            <FileList folder={selectedFolder}/>
        </div>
    );
};

const Folder = ({folder, onClick}: { folder: DropBoxFolder, onClick: (name: string | undefined) => void }) => {
    return (
        <div className={styles.folder} onClick={() => onClick(folder.name)}>
            <div>{folder.name}</div>
            <div className={styles.folderBottom}>{folder.files.length}</div>
        </div>
    );
};


const FileList = ({folder}: { folder: DropBoxFolder | undefined }) => {
    return (
        <div className={styles.folderDetails}>
                {folder?.files.map((file, index) => <div className={ index % 2 === 0 ? styles.odd : styles.even}>{file.name}</div>)}
        </div>
    );
};
