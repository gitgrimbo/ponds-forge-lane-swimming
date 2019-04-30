import React from "react";

export default function GitInfo({ gitInfo }) {
  return (
    <>
      <h2>Version Info</h2>
      <span>Hash: {gitInfo.hash}, Date: {gitInfo.date}</span>
    </>
  );
}
