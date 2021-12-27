import React, {useState} from 'react';
import styles from "./DropBox.module.scss";

export type DropBoxFolder = {
    description: string | undefined;
    files: File[];
}

export const DropBox = () => {


    const [folders, setFolders] = useState<DropBoxFolder[]>([])
    console.log(folders)

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
        const foundFolder = folders.find(folder => folder.description === fileExtension?.toLocaleUpperCase())

        if (!foundFolder) {
            const newFolder: DropBoxFolder = {description: fileExtension?.toLocaleUpperCase(), files: []}
            newFolder.files = [...newFolder.files, file]
            setFolders([...folders, newFolder])
        } else {
            const index = folders.findIndex(folder => folder.description === fileExtension?.toLocaleUpperCase())
            const updatedFolders = [...folders]
            updatedFolders[index].files = [...foundFolder.files, file]
            setFolders(updatedFolders)
        }

    }


    return (

        <div className={styles.dropArea} onDrop={onDrop} onDragOver={onDragOver}>

            {folders.map((folder, index) =>
                <div className={styles.folder}>
                    <div key={`folder-${index}`}>{folder.description}</div>
                    <div className={styles.folderBottom}>{folder.files.length}</div>
                </div>
            )}

        </div>
    );
};