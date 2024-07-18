import Home from "@/components/home/home";
import { home } from "@prisma/client";

async function getData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/home`, {
    method: "GET",
    headers: {
      'Cache-Control': 'no-store',
    },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  
  const data: { verified: home; pending: home } = await response.json();
  return data.verified;
}
export default async function Page() {
  const data = await getData();
  return (
    <Home data={data}/>
  )
}
