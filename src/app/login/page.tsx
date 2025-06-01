"use client"

import React, {useState} from 'react'
import CreatableSelect from 'react-select/creatable';

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Login from "@/components/Login";
export default function Home() {

  return (
    <div>
    <Login logo={"/Brasao_da_UEFS.png"} />
  </div>
  );
}
