import AllSongs from "@/components/AllSongs";
import Layout from "@/layouts/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="min-h-screen">
        <AllSongs />
      </div>
    </Layout>
  );
}
