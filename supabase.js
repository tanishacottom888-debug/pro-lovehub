// supabase.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://precvldulohwudpfmzsn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZWN2bGR1bG9od3VkcGZtenNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMDMwNzUsImV4cCI6MjEwMjU3OTA3NX0.BYpgOVlLG1cw5pdYfjrhI_bP615ALKCr1tb9U5Ooc0c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Auth functions
export async function signUp(email, password, profileData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: profileData.name } }
  })
  if (error) return { error }
  if (data.user) {
    const { error: updateError } = await supabase
      .from('members')
      .update({
        name: profileData.name,
        gender: profileData.gender,
        looking_for: profileData.lookingFor,
        dob: profileData.dob,
        location: profileData.location,
        bio: profileData.bio,
        interests: profileData.interests ? profileData.interests.split(',').map(s => s.trim()) : []
      })
      .eq('id', data.user.id)
    return { data, error: updateError }
  }
  return { data, error }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Member CRUD
export async function getAllMembers() {
  const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false })
  return { data, error }
}

export async function addMember(memberData) {
  const { data, error } = await supabase
    .from('members')
    .insert([{
      name: memberData.name,
      email: memberData.email,
      gender: memberData.gender,
      looking_for: memberData.looking_for,
      dob: memberData.dob,
      location: memberData.location,
      bio: memberData.bio,
      interests: memberData.interests,
      status: memberData.status || 'pending',
      source: 'admin'
    }])
    .select()
    .single()
  return { data, error }
}

export async function updateMember(id, updates) {
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteMember(id) {
  const { error } = await supabase.from('members').delete().eq('id', id)
  return { error }
}
