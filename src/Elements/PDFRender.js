import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const PDFRender = ({ rawImages }) => {
  const styles = StyleSheet.create({
    page: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,

      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    image: {
      objectFit: "contain",
    },
  });

  return (
    <Document>
      {rawImages.length
        ? rawImages.map((item) => {
            return (
              <Page size="A4" style={styles.page} wrap key={item.pId}>
                <Image style={styles.image} src={item.img64} />
              </Page>
            );
          })
        : ""}
    </Document>
  );
};

export default PDFRender;
