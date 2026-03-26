import React, { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import Header from "../components/Header";

export default function GroupsPage() {
  const { myGroups, createGroup, inviteToGroup, leaveGroup, getGroupDetail, setPage, groupsLoading } = useApp();
  const [tab, setTab]               = useState("list");
  const [detailGroup, setDetailGroup] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const openDetail = async (group) => {
    setDetailLoading(true);
    setTab("detail");
    const full = await getGroupDetail(group.group_id);
    setDetailGroup(full || group);
    setDetailLoading(false);
  };

  const back = () => { setDetailGroup(null); setTab("list"); };

  return (
    <div style={s.root}>
      <Header />
      <div style={s.main}>
        {tab !== "detail" && (
          <div style={s.topBar}>
            <div>
              <h1 style={s.heading}>Группы</h1>
              <p style={s.sub}>Создайте группу и получайте совместные рекомендации с друзьями</p>
            </div>
            <button style={s.backBtn} onClick={() => setPage("home")}>← На главную</button>
          </div>
        )}
        {tab === "list"   && <ListView myGroups={myGroups} loading={groupsLoading} onOpenDetail={openDetail} setTab={setTab} leaveGroup={leaveGroup} />}
        {tab === "create" && <CreateForm onBack={back} createGroup={createGroup} onSuccess={(g) => openDetail(g)} />}
        {tab === "detail" && <DetailView group={detailGroup} loading={detailLoading} onBack={back} inviteToGroup={inviteToGroup} leaveGroup={leaveGroup} />}
      </div>
    </div>
  );
}

function ListView({ myGroups, loading, onOpenDetail, setTab, leaveGroup }) {
  return (
    <div>
      <div style={s.actionRow}>
        <button style={s.actionCard} onClick={() => setTab("create")}>
          <span style={s.actionIcon}>➕</span>
          <span style={s.actionTitle}>Создать группу</span>
          <span style={s.actionDesc}>Получите ID группы и поделитесь им</span>
        </button>
      </div>
      <div style={s.sectionLabel}>
        Мои группы <span style={s.sectionCount}>{myGroups.length}</span>
      </div>
      {loading ? (
        <div style={s.loaderText}>Загружаем группы...</div>
      ) : myGroups.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>👥</div>
          <h3 style={s.emptyTitle}>Вы пока не в группах</h3>
          <p style={s.emptyText}>Создайте группу и пригласите друзей по email</p>
        </div>
      ) : (
        <div style={s.groupList}>
          {myGroups.map((g) => (
            <GroupCard key={g.group_id} group={g}
              onOpen={() => onOpenDetail(g)}
              onLeave={() => leaveGroup(g.group_id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupCard({ group, onOpen, onLeave }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ ...s.groupCard, ...(hover ? s.groupCardHover : {}) }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={s.groupCardLeft} onClick={onOpen}>
        <div style={s.groupAvatar}>{group.name[0].toUpperCase()}</div>
        <div>
          <div style={s.groupName}>{group.name}</div>
          <div style={s.groupMeta}>
            <span style={s.codeChip}>ID: {group.group_id}</span>
          </div>
        </div>
      </div>
      <div style={s.groupCardRight}>
        <button style={s.openBtn} onClick={onOpen}>Открыть →</button>
        <button style={s.leaveBtn} onClick={(e) => { e.stopPropagation(); onLeave(); }}>Покинуть</button>
      </div>
    </div>
  );
}

function CreateForm({ onBack, createGroup, onSuccess }) {
  const [name, setName]   = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    const result = await createGroup(name);
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    onSuccess(result.group);
  };

  return (
    <div style={s.formWrap}>
      <button style={s.breadcrumb} onClick={onBack}>← Назад к группам</button>
      <h2 style={s.formTitle}>Создать группу</h2>
      <p style={s.formSub}>После создания вы получите числовой ID группы. Поделитесь им с другом — он сможет попросить вас пригласить его по email.</p>
      <div style={s.field}>
        <label style={s.label}>Название группы</label>
        <input style={s.input} placeholder="Например: «Кино по пятницам»"
          value={name} onChange={e => { setName(e.target.value); setError(""); }} autoFocus />
      </div>
      {error && <div style={s.errorBox}>{error}</div>}
      <button style={s.submitBtn} onClick={handle} disabled={loading || !name.trim()}>
        {loading ? "Создаём..." : "Создать группу →"}
      </button>
    </div>
  );
}

function DetailView({ group, loading, onBack, inviteToGroup, leaveGroup }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);
  const { user } = useApp();

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteLoading(true);
    setInviteResult(null);
    const res = await inviteToGroup(group.group_id, inviteEmail.trim());
    setInviteLoading(false);
    setInviteResult(res);
    if (res.ok) setInviteEmail("");
  };

  const handleLeave = async () => {
    await leaveGroup(group.group_id);
    onBack();
  };

  if (loading || !group) {
    return (
      <div>
        <button style={s.breadcrumb} onClick={onBack}>← Все группы</button>
        <div style={s.loaderText}>Загружаем группу...</div>
      </div>
    );
  }

  return (
    <div>
      <button style={s.breadcrumb} onClick={onBack}>← Все группы</button>
      <div style={s.detailHeader}>
        <div style={s.detailAvatar}>{group.name[0].toUpperCase()}</div>
        <div>
          <h2 style={s.detailTitle}>{group.name}</h2>
          <div style={s.detailMeta}>
            <span style={s.codeChip}>ID группы: {group.group_id}</span>
          </div>
        </div>
      </div>

      <div style={s.detailGrid}>
        <div style={s.panel}>
          <div style={s.panelTitle}>
            Участники <span style={s.panelCount}>{group.members?.length || 0}</span>
          </div>
          <div style={s.memberList}>
            {(group.members || []).map((m) => (
              <div key={m.user_id} style={s.memberRow}>
                <div style={s.memberAvatar}>{m.name[0].toUpperCase()}</div>
                <div>
                  <div style={s.memberName}>
                    {m.name}
                    {m.user_id === user?.user_id && <span style={s.youMark}> (вы)</span>}
                  </div>
                  <div style={s.memberSub}>ID: {m.user_id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={s.panel}>
          <div style={s.panelTitle}>Пригласить участника</div>
          <p style={s.panelSub}>Введите email пользователя, зарегистрированного в системе</p>
          <div style={s.inviteRow}>
            <input style={s.inviteInput} type="email" placeholder="email@example.com"
              value={inviteEmail} onChange={e => { setInviteEmail(e.target.value); setInviteResult(null); }} />
            <button style={s.inviteBtn} onClick={handleInvite}
              disabled={inviteLoading || !inviteEmail.trim()}>
              {inviteLoading ? "..." : "Пригласить"}
            </button>
          </div>
          {inviteResult && (
            <div style={{ ...s.inviteMsg, ...(inviteResult.ok ? s.inviteMsgOk : s.inviteMsgErr) }}>
              {inviteResult.ok ? "✓ Пользователь добавлен в группу" : inviteResult.error}
            </div>
          )}
        </div>
      </div>

      <GroupRecommendations groupId={group.group_id} />

      <button style={s.leaveFullBtn} onClick={handleLeave}>Покинуть группу</button>
    </div>
  );
}

// ── ГРУППОВЫЕ РЕКОМЕНДАЦИИ ────────────────────────────────────────────────────
function GroupRecommendations({ groupId }) {
  const { getGroupRecommendations } = useApp();
  const [status, setStatus]     = useState("idle");
  const [items, setItems]       = useState([]);
  const [profile, setProfile]   = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchRecs = useCallback(async () => {
    setStatus("loading");
    setItems([]);
    setProfile("");
    setErrorMsg("");
    const res = await getGroupRecommendations(groupId);
    if (res.ok) {
      setItems(res.data.items || []);
      setProfile(res.data.group_profile || "");
      setStatus("done");
    } else {
      setErrorMsg(res.error || "Не удалось получить рекомендации");
      setStatus("error");
    }
  }, [groupId, getGroupRecommendations]);

  return (
    <div style={s.recoSection}>
      <div style={s.recoHeader}>
        <div style={s.recoHeaderLeft}>
          <span style={s.recoStar}>✦</span>
          <div>
            <div style={s.recoTitle}>Групповые рекомендации</div>
            <div style={s.recoSubtitle}>ИИ подберёт фильмы, которые понравятся всем участникам</div>
          </div>
        </div>
        <button
          style={{ ...s.recoBtn, ...(status === "loading" ? s.recoBtnDisabled : {}) }}
          onClick={fetchRecs}
          disabled={status === "loading"}
        >
          {status === "loading" ? <><LoadingDots /> Подбираем...</> : status === "done" ? "↺ Обновить" : "✦ Подобрать фильмы"}
        </button>
      </div>

      {status === "idle" && (
        <div style={s.recoIdle}>
          <div style={s.recoIdleIcon}>🎬</div>
          <div style={s.recoIdleText}>Нажмите «Подобрать фильмы», чтобы ИИ нашёл варианты для всей группы</div>
        </div>
      )}

      {status === "loading" && (
        <div style={s.recoLoadingWrap}>
          <div style={s.recoLoadingBar}><div style={s.recoLoadingFill} /></div>
          <div style={s.recoLoadingText}>Анализируем вкусы участников группы...</div>
        </div>
      )}

      {status === "error" && (
        <div style={s.recoError}>
          <span style={s.recoErrorIcon}>⚠</span>
          <div>
            <div style={s.recoErrorTitle}>Не удалось получить рекомендации</div>
            <div style={s.recoErrorText}>{errorMsg}</div>
          </div>
        </div>
      )}

      {status === "done" && (
        <>
          {profile && (
            <div style={s.groupProfileBox}>
              <span style={s.groupProfileLabel}>Вкус группы</span>
              <span style={s.groupProfileText}>{profile}</span>
            </div>
          )}
          {items.length === 0 ? (
            <div style={s.recoEmpty}>Рекомендации не найдены — попробуйте добавить больше фильмов в избранное</div>
          ) : (
            <div style={s.recoList}>
              {items.map((film, i) => <RecoCard key={i} film={film} index={i} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function RecoCard({ film, index }) {
  const [expanded, setExpanded] = useState(false);
  const score = film.score != null ? Math.round(film.score * 100) : null;
  const barColor = score >= 80
    ? "linear-gradient(90deg, #c9a227, #f0d060)"
    : score >= 60
    ? "linear-gradient(90deg, #6a9fd8, #a8c8f0)"
    : "linear-gradient(90deg, #888, #aaa)";

  return (
    <div style={s.recoCard}>
      <div style={s.recoIndex}>{String(index + 1).padStart(2, "0")}</div>
      <div style={s.recoCardBody}>
        <div style={s.recoCardTop}>
          <div style={s.recoCardMeta}>
            <span style={s.recoFilmTitle}>{film.title}</span>
            {film.year && <span style={s.recoFilmYear}>{film.year}</span>}
          </div>
          <div style={s.recoCardRight}>
            {score !== null && (
              <div style={s.scoreWrap}>
                <div style={{ ...s.scoreBar, width: `${score}%`, background: barColor }} />
                <span style={s.scoreLabel}>{score}%</span>
              </div>
            )}
            <button style={s.expandBtn} onClick={() => setExpanded(v => !v)}>
              {expanded ? "▲ Скрыть" : "▼ Почему?"}
            </button>
          </div>
        </div>
        {film.genres && film.genres.length > 0 && (
          <div style={s.genreRow}>
            {film.genres.map((g, j) => <span key={j} style={s.genreChip}>{g}</span>)}
          </div>
        )}
        {expanded && film.reason && (
          <div style={s.reasonBox}>
            <span style={s.reasonIcon}>💡</span>
            <span style={s.reasonText}>{film.reason}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 2, marginRight: 6 }}>
      {[0, 0.2, 0.4].map((d, i) => (
        <span key={i} style={{ ...s.dot, animationDelay: `${d}s` }}>•</span>
      ))}
    </span>
  );
}

// ── Keyframes (один раз при загрузке модуля) ──────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("reco-kf")) {
  const el = document.createElement("style");
  el.id = "reco-kf";
  el.textContent = `
    @keyframes recoSlide {
      0%   { transform: translateX(-150%); }
      100% { transform: translateX(400%); }
    }
    @keyframes recoBlink {
      0%, 80%, 100% { opacity: 0.25; }
      40%            { opacity: 1; }
    }
  `;
  document.head.appendChild(el);
}

const s = {
  root: { minHeight: "100vh", background: "linear-gradient(160deg, #0a0a0f 0%, #0f0e18 60%, #0d0d1c 100%)", fontFamily: "'DM Sans', sans-serif" },
  main: { maxWidth: 1000, margin: "0 auto", padding: "48px 40px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 16 },
  heading: { fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: "#fff", marginBottom: 8 },
  sub: { color: "rgba(255,255,255,0.4)", fontSize: 14 },
  backBtn: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 20px", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 },
  loaderText: { color: "rgba(255,255,255,0.4)", textAlign: "center", paddingTop: 60, fontSize: 16 },
  actionRow: { display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 40, maxWidth: 360 },
  actionCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 24px", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 8, fontFamily: "'DM Sans', sans-serif" },
  actionIcon: { fontSize: 28 },
  actionTitle: { color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif" },
  actionDesc: { color: "rgba(255,255,255,0.4)", fontSize: 13 },
  sectionLabel: { color: "rgba(255,255,255,0.35)", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 },
  sectionCount: { background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "2px 10px", fontSize: 12, color: "rgba(255,255,255,0.5)" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60, gap: 10 },
  emptyIcon: { fontSize: 56, marginBottom: 8 },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", fontWeight: 700 },
  emptyText: { color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 1.7, fontSize: 14 },
  groupList: { display: "flex", flexDirection: "column", gap: 12 },
  groupCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s", gap: 16 },
  groupCardHover: { borderColor: "rgba(201,162,39,0.25)", background: "rgba(201,162,39,0.04)" },
  groupCardLeft: { display: "flex", alignItems: "center", gap: 16, cursor: "pointer", flex: 1 },
  groupAvatar: { width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #3a2f6e, #5b45a8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 },
  groupName: { color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 6 },
  groupMeta: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  codeChip: { background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)", color: "#c9a227", borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700, fontFamily: "monospace" },
  groupCardRight: { display: "flex", gap: 8, flexShrink: 0 },
  openBtn: { background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)", borderRadius: 8, padding: "8px 16px", color: "#c9a227", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 },
  leaveBtn: { background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: 8, padding: "8px 16px", color: "rgba(255,100,100,0.7)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" },
  formWrap: { maxWidth: 520 },
  breadcrumb: { background: "transparent", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: 0, marginBottom: 20, display: "block" },
  formTitle: { fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#fff", fontWeight: 700, marginBottom: 8 },
  formSub: { color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.7, marginBottom: 28 },
  field: { display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 },
  label: { color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 500 },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none" },
  errorBox: { background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.25)", borderRadius: 8, padding: "10px 14px", color: "#ff7070", fontSize: 13, marginBottom: 16 },
  submitBtn: { background: "linear-gradient(135deg, #c9a227, #e8c547)", border: "none", borderRadius: 12, padding: "14px 32px", color: "#0a0a0f", cursor: "pointer", fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 },
  detailHeader: { display: "flex", alignItems: "center", gap: 20, marginBottom: 28 },
  detailAvatar: { width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #3a2f6e, #5b45a8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#fff" },
  detailTitle: { fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#fff", fontWeight: 700, marginBottom: 8 },
  detailMeta: { display: "flex", gap: 12 },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 },
  panel: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 22 },
  panelTitle: { color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 },
  panelSub: { color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 14, lineHeight: 1.6 },
  panelCount: { background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "2px 9px", fontSize: 11, color: "rgba(255,255,255,0.4)" },
  memberList: { display: "flex", flexDirection: "column", gap: 14 },
  memberRow: { display: "flex", alignItems: "center", gap: 12 },
  memberAvatar: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #1e3a5f, #2d6a9f)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 },
  memberName: { color: "#fff", fontSize: 14, fontWeight: 600 },
  memberSub: { color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 2 },
  youMark: { color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: 12 },
  inviteRow: { display: "flex", gap: 10, marginBottom: 12 },
  inviteInput: { flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" },
  inviteBtn: { background: "linear-gradient(135deg, #c9a227, #e8c547)", border: "none", borderRadius: 10, padding: "11px 18px", color: "#0a0a0f", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, whiteSpace: "nowrap" },
  inviteMsg: { borderRadius: 8, padding: "8px 12px", fontSize: 13, marginBottom: 4 },
  inviteMsgOk: { background: "rgba(100,200,100,0.1)", border: "1px solid rgba(100,200,100,0.25)", color: "#6dc96d" },
  inviteMsgErr: { background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.25)", color: "#ff7070" },
  leaveFullBtn: { background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: 10, padding: "12px 24px", color: "rgba(255,100,100,0.7)", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginTop: 8, display: "block" },

  // ── Рекомендации ──────────────────────────────────────────────────────────
  recoSection: { background: "rgba(201,162,39,0.04)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: 18, padding: "28px 28px 24px", marginBottom: 24 },
  recoHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 16, flexWrap: "wrap" },
  recoHeaderLeft: { display: "flex", alignItems: "center", gap: 14 },
  recoStar: { fontSize: 28, color: "#c9a227", lineHeight: 1 },
  recoTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 },
  recoSubtitle: { color: "rgba(255,255,255,0.35)", fontSize: 13 },
  recoBtn: { background: "linear-gradient(135deg, #c9a227, #e8c547)", border: "none", borderRadius: 10, padding: "11px 22px", color: "#0a0a0f", cursor: "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 },
  recoBtnDisabled: { opacity: 0.6, cursor: "not-allowed" },
  recoIdle: { display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0", gap: 12 },
  recoIdleIcon: { fontSize: 44 },
  recoIdleText: { color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", maxWidth: 380, lineHeight: 1.6 },
  recoLoadingWrap: { padding: "24px 0 8px" },
  recoLoadingBar: { height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden", marginBottom: 16 },
  recoLoadingFill: { height: "100%", width: "45%", background: "linear-gradient(90deg, transparent, #c9a227, transparent)", animation: "recoSlide 1.4s ease-in-out infinite", borderRadius: 4 },
  recoLoadingText: { color: "rgba(255,255,255,0.35)", fontSize: 13, textAlign: "center" },
  recoError: { display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.2)", borderRadius: 10, padding: "14px 18px" },
  recoErrorIcon: { fontSize: 18, color: "#ff7070", flexShrink: 0, marginTop: 1 },
  recoErrorTitle: { color: "#ff7070", fontWeight: 600, fontSize: 14, marginBottom: 4 },
  recoErrorText: { color: "rgba(255,150,150,0.6)", fontSize: 13, lineHeight: 1.5 },
  recoEmpty: { color: "rgba(255,255,255,0.35)", fontSize: 13, textAlign: "center", padding: "24px 0" },
  groupProfileBox: { background: "rgba(201,162,39,0.06)", border: "1px solid rgba(201,162,39,0.12)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-start" },
  groupProfileLabel: { color: "#c9a227", fontSize: 10, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700, whiteSpace: "nowrap", paddingTop: 2 },
  groupProfileText: { color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6 },
  recoList: { display: "flex", flexDirection: "column", gap: 10 },
  recoCard: { display: "flex", gap: 16, alignItems: "flex-start", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px" },
  recoIndex: { fontFamily: "monospace", fontSize: 11, color: "rgba(201,162,39,0.5)", fontWeight: 700, paddingTop: 3, minWidth: 24, flexShrink: 0 },
  recoCardBody: { flex: 1, minWidth: 0 },
  recoCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" },
  recoCardMeta: { display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" },
  recoFilmTitle: { color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "'Playfair Display', serif" },
  recoFilmYear: { color: "rgba(255,255,255,0.35)", fontSize: 13 },
  recoCardRight: { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
  scoreWrap: { display: "flex", alignItems: "center", gap: 8 },
  scoreBar: { height: 4, borderRadius: 3, width: 60 },
  scoreLabel: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, minWidth: 34 },
  expandBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 10px", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" },
  genreRow: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 },
  genreChip: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "2px 9px", fontSize: 11, color: "rgba(255,255,255,0.45)" },
  reasonBox: { display: "flex", gap: 10, alignItems: "flex-start", background: "rgba(201,162,39,0.05)", borderRadius: 8, padding: "10px 12px", marginTop: 8 },
  reasonIcon: { fontSize: 14, flexShrink: 0, paddingTop: 1 },
  reasonText: { color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6 },
  dot: { display: "inline-block", animation: "recoBlink 1s ease-in-out infinite", fontSize: 16 },
};
