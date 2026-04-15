import React, { Fragment } from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

type SanitizedContentProps = { content?: string | null };

const parseHtml = parse as unknown as (html: string) => React.ReactNode;

const SanitizedContent: React.FC<SanitizedContentProps> = ({ content }) => (
  <Fragment>{content && parseHtml(DOMPurify.sanitize(content))}</Fragment>
);

export default SanitizedContent;
