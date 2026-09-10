export type MaterialKind = 'resume' | 'screening' | 'assessment' | 'other';
export type Material = { id: string; name: string; text: string; readStatus: string; errorCode: string | null; segments: { id: string; text: string; page?: number }[] };
export type Fact = { value: string; segmentId: string; quote: string; category?: string };
export type ParseResult = { title: Fact | null; name: Fact | null; email: Fact | null; facts: Fact[]; warnings: string[]; missingFields: string[]; sourceId: string };
export type ParseJob = { id: string; type: string; materialId: string | null; inputVersion: number; status: string; errorCode: string | null; result: ParseResult | null };
export type ProjectSummary = { id: string; title: string; candidateName: string | null; reviewed: boolean; createdAt: string; version: number };
export type Project = ProjectSummary & { candidateEmail: string | null; jdText: string; jdVersion: number; jobs: ParseJob[]; materials: { kind: string; material: Material }[] };
export class ApiError extends Error { constructor(public code: string) { super(code); } }
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try { response = await fetch(`/api${path}`, { ...init, headers: { ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...init?.headers } }); }
  catch { throw new ApiError('NETWORK_ERROR'); }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.code || (response.status === 413 ? 'FILE_TOO_LARGE' : 'REQUEST_FAILED'));
  }
  return response.json();
}
export async function uploadMaterial(file: File) {
  if (file.size > 10 * 1024 * 1024) throw new ApiError('FILE_TOO_LARGE');
  if (!/\.(pdf|docx|txt)$/i.test(file.name)) throw new ApiError('UNSUPPORTED_FILE_TYPE');
  const data = new FormData(); data.append('file', file);
  return api<Material>('/materials', { method: 'POST', body: data });
}
