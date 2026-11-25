"""Shared URL extraction and evidence-parity checks for Atlas validators."""

import re


URL_RE = re.compile(r'https?://[^\s\)\]>"]+')
REFERENCES_RE = re.compile(r'^##\s+References\b[^\n]*\n(.*?)(?=^##\s+|\Z)', re.M | re.S | re.I)
DEPRECATED_URL_RE = re.compile(r'https?://(?:www\.)?npci\.org\.in/what-we-do/upi/', re.I)


def external_urls(text):
    return sorted({url.rstrip('.,;\'"\x60').replace('&amp;', '&') for url in URL_RE.findall(text)})


def reference_urls(text):
    section = REFERENCES_RE.search(text.replace('\r\n', '\n'))
    return (True, external_urls(section.group(1))) if section else (False, [])


def missing_evidence_urls(refs, evidence_text):
    return sorted(set(refs) - set(external_urls(evidence_text)))


def deprecated_url_reason(url):
    if DEPRECATED_URL_RE.search(url):
        return 'Retired NPCI SPA route; replace with canonical /product/upi/* or /faqs/upi URLs'
