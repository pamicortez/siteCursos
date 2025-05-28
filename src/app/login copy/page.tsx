"use client"

import React, {useState} from 'react'
import CreatableSelect from 'react-select/creatable';

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Signup from "@/components/SignUp";
export default function Home() {

  return (
    <div>
    <Navbar />
    <Signup/>
  </div>
  );
}
