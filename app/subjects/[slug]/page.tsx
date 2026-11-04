import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getSubjectScopeDefinition,
  getAllSubjectScopeSlugs,
} from "@/features/curriculum/utils/subject-scope-data";
import { SubjectScopeView } from "@/features/curriculum/components/SubjectScopeView";
import {
  JsonLd,
  buildSubjectCourseSchema,
  buildSubjectBreadcrumbSchema,
  buildPageMetadata,
} from "@/features/seo";

interface SubjectScopePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  const slugs = getAllSubjectScopeSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: SubjectScopePageProps): Promise<Metadata> {
  const { slug } = await params;
  const subject = getSubjectScopeDefinition(slug);

  if (!subject) {
    return buildPageMetadata({
      title: "Subject Not Found",
      description: "DepEd curriculum subject scope not found.",
      path: `/subjects/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${subject.name} (${subject.grade}) - DepEd MATATAG Scope`,
    description: subject.description,
    path: `/subjects/${slug}`,
  });
}

export default async function SubjectScopePage({ params }: SubjectScopePageProps) {
  const { slug } = await params;
  const subject = getSubjectScopeDefinition(slug);

  if (!subject) {
    notFound();
  }

  const courseSchema = buildSubjectCourseSchema(subject);
  const breadcrumbSchema = buildSubjectBreadcrumbSchema(subject);

  return (
    <>
      <JsonLd schema={courseSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <div className="min-h-screen bg-muted/20 dark:bg-background pb-20 pt-8 sm:pt-10">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <SubjectScopeView subject={subject} />
        </div>
      </div>
    </>
  );
}
