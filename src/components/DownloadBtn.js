import { useContext, useCallback } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import * as download from '../utils/download';
import AppContext from '../AppContext'; // Assuming your data is in AppContext
import { Button } from 'antd';
import styles from "./style.css"

export default () => {
  const { data } = useContext(AppContext);
  const downloadData = useCallback(() => {
    // Deep copy the data to avoid modifying the original state
    const dataToDownload = JSON.parse(data);

    // Convert degrees to radians in the 'animStates' array
    dataToDownload.animStates.forEach(animState => {
      Object.values(animState.imports).forEach(boneData => {
        boneData.delAngularPos = boneData.delAngularPos * (Math.PI / 180);
      });
    });

    download.text({
      name: 'anim-data',
      format: 'cson',
      body: JSON.stringify(dataToDownload)
    });
  }, [data]);

  return (
    <Button className={styles.downloadBtn} onClick={downloadData} icon={<DownloadOutlined />}>
      Data
    </Button>
  );
};