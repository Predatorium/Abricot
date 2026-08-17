import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProfileAction } from "@/actions/authActions";
import { getAllProjectsAction } from "@/actions/projectActions";
import { ProjectModalProvider } from '@/contexts/ProjectModalContext';
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import AppProviders from "@/contexts/AppProviders";
import ProjectModal from '@/components/Modals/ProjectModal';
import styles from './layout.module.css'

export default async function ProtectedLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/login");
  }

  let initialUser = null;
  let initialProjects = [];

  try {
    const [profileResult, projectsResult] = await Promise.all([
      getProfileAction(),
      getAllProjectsAction(),
    ]);
    initialUser = profileResult.data.user;
    initialProjects = projectsResult.data.projects;
  } catch (error) {
    // Token invalide/expiré côté backend -> retour au login
    redirect("/login");
  }

  return (
    <AppProviders initialUser={initialUser} initialProjects={initialProjects}>
      <ProjectModalProvider>
        <div className={styles.layout}>
          <Header />
          <main className={styles.main}>
            {children}
            <ProjectModal />
          </main>
          <Footer />
        </div>
      </ProjectModalProvider>
    </AppProviders>
  );
}
