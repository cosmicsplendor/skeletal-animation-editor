import { useContext, useCallback } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import download from 'downloadjs';
import AppContext from './AppContext'; // Assuming your data is in AppContext

export default () => {
  const { data } = useContext(AppContext);

  const downloadData = useCallback(() => {
    // Deep copy the data to avoid modifying the original state
    const dataToDownload = JSON.parse(JSON.stringify(data));

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