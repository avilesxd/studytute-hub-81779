create or replace function get_user_calendar(p_user_id uuid)
returns table (
    tutoring_id uuid,
    tutoring_name text,
    tutoring_date timestamp with time zone,
    role text
)
as $$
begin
    return query
    -- Tutorings where the user is the tutor
    select t.id, t.name, t.date, 'tutor' as role
    from public.tutorings t
    where t.tutor_id = p_user_id

    union all

    -- Tutorings where the user is enrolled
    select t.id, t.name, t.date, 'student' as role
    from public.tutorings t
    join public.enrollments e on t.id = e.tutoring_id
    where e.user_id = p_user_id;
end;
$$ language plpgsql;